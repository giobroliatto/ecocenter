export const suggestResidues = async (req, res) => {
    const { query, residueTypes } = req.body;

    if (!query || !residueTypes || !Array.isArray(residueTypes)) {
        return res.status(400).json({ error: 'query e residueTypes são obrigatórios' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return res.status(503).json({ error: 'Serviço de IA não configurado' });
    }

    const prompt = `Você é um assistente de reciclagem brasileiro. O usuário descreveu o que quer descartar e você deve identificar quais categorias de resíduos se encaixam.

Categorias disponíveis: ${JSON.stringify(residueTypes)}

O usuário disse: "${query}"

Retorne SOMENTE um array JSON com os nomes exatos das categorias que se encaixam. Use apenas nomes da lista acima. Se nada se encaixar, retorne [].
Exemplo de resposta: ["Papel", "Plástico"]`;

    try {
        const response = await fetch(
            'https://api.anthropic.com/v1/messages',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: process.env.CLAUDE_MODEL || 'claude-haiku-4-5',
                    max_tokens: 200,
                    messages: [{ role: 'user', content: prompt }],
                }),
            }
        );

        if (!response.ok) {
            const errBody = await response.text();
            console.error('Anthropic API error:', errBody);
            return res.status(502).json({ error: 'Erro na API de IA' });
        }

        const data = await response.json();
        const text = data.content?.[0]?.text?.trim() || '[]';

        const jsonMatch = text.match(/\[[\s\S]*\]/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        const validMatches = parsed.filter(m => residueTypes.includes(m));

        res.json({ matches: validMatches });
    } catch (error) {
        console.error('Erro no serviço de IA:', error);
        res.status(500).json({ error: 'Erro interno no serviço de IA' });
    }
};
