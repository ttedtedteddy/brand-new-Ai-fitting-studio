const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

  // API 토큰 확인
  if (!REPLICATE_API_TOKEN) {
    return res.status(500).json({ 
      error: 'REPLICATE_API_TOKEN 환경변수가 설정되지 않았습니다.',
      details: 'Vercel 대시보드에서 환경변수를 설정해주세요.' 
    });
  }

  if (req.method === 'POST') {
    try {
      const { version, input } = req.body;
      
      if (!version || !input) {
        return res.status(400).json({ error: '버전과 입력 데이터가 필요합니다.' });
      }

      // Replicate API 호출
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: version,
          input: input
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Replicate API 오류:', errorText);
        return res.status(response.status).json({ 
          error: 'Replicate API 호출 실패',
          details: errorText 
        });
      }

      const prediction = await response.json();
      return res.status(200).json(prediction);

    } catch (error) {
      console.error('Replicate API 오류:', error);
      return res.status(500).json({ 
        error: 'Replicate API 호출 실패',
        details: error.message 
      });
    }
  }

  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Prediction ID가 필요합니다.' });
      }

      // Prediction 상태 확인
      const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Replicate 상태 확인 오류:', errorText);
        return res.status(response.status).json({ 
          error: 'Prediction 상태 확인 실패',
          details: errorText 
        });
      }

      const prediction = await response.json();
      return res.status(200).json(prediction);

    } catch (error) {
      console.error('Prediction 상태 확인 오류:', error);
      return res.status(500).json({ 
        error: 'Prediction 상태 확인 실패',
        details: error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}; 