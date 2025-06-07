const { v2: cloudinary } = require('cloudinary');

// Cloudinary 설정
cloudinary.config({
  cloud_name: 'dwt9va79z',
  api_key: '341829715538849',
  api_secret: 'ftBZn-S__Au9rojUfvNAfJQE5oY'
});

module.exports = async function handler(req, res) {
  // 성능 측정 시작
  const startTime = Date.now();
  
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

    // 이미지 크기 계산 (대략적인 크기)
    const imageSizeKB = Math.round((image.length * 3) / 4 / 1024);
    console.log(`📊 업로드 시작 - 이미지 크기: ${imageSizeKB}KB`);

    // Cloudinary 업로드 시작 시간
    const uploadStartTime = Date.now();

    // Cloudinary에 이미지 업로드
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${image}`, {
      folder: 'ai-fitting-studio',
      resource_type: 'image',
      format: 'png'
    });

    // 업로드 완료 시간 측정
    const uploadEndTime = Date.now();
    const uploadDuration = uploadEndTime - uploadStartTime;
    const totalDuration = uploadEndTime - startTime;

    console.log(`⚡ Cloudinary 업로드 완료:`);
    console.log(`   - 업로드 시간: ${uploadDuration}ms`);
    console.log(`   - 총 처리 시간: ${totalDuration}ms`);
    console.log(`   - 업로드 속도: ${(imageSizeKB / (uploadDuration / 1000)).toFixed(2)} KB/s`);
    console.log(`   - 파일 URL: ${result.secure_url}`);

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      // 성능 정보 추가
      performance: {
        uploadTime: uploadDuration,
        totalTime: totalDuration,
        imageSizeKB: imageSizeKB,
        uploadSpeedKBps: Math.round(imageSizeKB / (uploadDuration / 1000))
      }
    });

  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.error(`❌ 이미지 업로드 오류 (${errorTime}ms):`, error);
    
    return res.status(500).json({ 
      error: '이미지 업로드 실패',
      details: error.message,
      errorTime: errorTime
    });
  }
}; 