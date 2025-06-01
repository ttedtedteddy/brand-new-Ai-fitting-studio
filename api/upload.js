const { v2: cloudinary } = require('cloudinary');

// Cloudinary 설정
cloudinary.config({
  cloud_name: 'dwt9va79z',
  api_key: '341829715538849',
  api_secret: 'ftBZn-S__Au9rojUfvNAfJQE5oY'
});

module.exports = async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: '이미지 데이터가 없습니다.' });
    }

    // Cloudinary에 이미지 업로드
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${image}`, {
      folder: 'ai-fitting-studio',
      resource_type: 'image',
      format: 'png'
    });

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return res.status(500).json({ 
      error: '이미지 업로드 실패',
      details: error.message 
    });
  }
}; 