import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const systemPrompt = `You are Fyntraq, a friendly AI money buddy that helps users track their expenses through conversation.

Your job:
1. Parse user messages to extract expense information (amount, category, description)
2. Respond conversationally and confirm when expenses are logged
3. Help users understand their spending

When you detect an expense:
- Extract: amount (number), category (text), description (text), date (default to today)
- Valid categories: Food, Transport, Shopping, Entertainment, Bills, Health, Other
- Respond with confirmation like "Got it! I logged $X for [category]"

When you DON'T detect an expense:
- Answer questions about spending
- Provide encouragement
- Help clarify what they want to track

Be casual, friendly, and use emojis occasionally. Keep responses short and helpful.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []).slice(-10),
    ];

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        tools: [{
          type: "function",
          function: {
            name: "log_expense",
            description: "Log an expense when the user mentions spending money",
            parameters: {
              type: "object",
              properties: {
                amount: { type: "number", description: "The amount spent" },
                category: { 
                  type: "string", 
                  enum: ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Health", "Other"],
                  description: "The expense category" 
                },
                name: { type: "string", description: "Short description of the expense" },
                notes: { type: "string", description: "Additional notes" }
              },
              required: ["amount", "category", "name"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: "auto"
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const aiMessage = aiData.choices[0].message;
    
    let expenseDetected = false;
    let response = aiMessage.content || "I'm here to help! Just tell me what you spent.";

    if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
      const toolCall = aiMessage.tool_calls[0];
      if (toolCall.function.name === "log_expense") {
        const expenseData = JSON.parse(toolCall.function.arguments);
        
        const { error: insertError } = await supabase
          .from('expenses')
          .insert({
            user_id: user.id,
            amount: expenseData.amount,
            category: expenseData.category,
            name: expenseData.name,
            notes: expenseData.notes || null,
            date: new Date().toISOString().split('T')[0],
            type: 'expense',
            status: 'logged'
          });

        if (insertError) {
          console.error("Error inserting expense:", insertError);
          response = "I understood the expense but had trouble saving it. Please try again!";
        } else {
          expenseDetected = true;
          response = `Got it! I logged $${expenseData.amount} for ${expenseData.category}. ${expenseData.name} ✅`;
        }
      }
    }

    return new Response(
      JSON.stringify({ response, expenseDetected }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("Error in parse-expense:", error);
    return new Response(
      JSON.stringify({ 
        response: "Sorry, I had trouble processing that. Please try again! 😊",
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
