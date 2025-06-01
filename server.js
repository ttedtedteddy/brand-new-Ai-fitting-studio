// 환경변수 로드
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// Replicate API 키 (환경변수에서 가져오기)
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// Cloudinary 환경설정
cloudinary.config({
  cloud_name: 'dwt9va79z',
  api_key: '341829715538849',
  api_secret: 'ftBZn-S__Au9rojUfvNAfJQE5oY'
});

// 이미지 업로드 엔드포인트 (Cloudinary 사용)
app.post('/upload', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: '이미지 데이터가 없습니다.' });
    }

    // base64 데이터를 data URI로 변환
    const dataUri = `data:image/png;base64,${image}`;
    
    // Cloudinary에 업로드
    const uploadRes = await cloudinary.uploader.upload(dataUri, {
      folder: 'ai-styling',
      resource_type: 'image'
    });

    if (uploadRes && uploadRes.secure_url) {
      res.json({ url: uploadRes.secure_url });
    } else {
      res.status(500).json({ 
        error: 'Cloudinary 업로드 실패', 
        details: uploadRes 
      });
    }
  } catch (error) {
    console.error('업로드 오류:', error);
    res.status(500).json({ 
      error: '이미지 업로드 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// Replicate API 호출 엔드포인트
app.post('/replicate', async (req, res) => {
  try {
    if (!REPLICATE_API_TOKEN || REPLICATE_API_TOKEN === 'your-replicate-api-token-here') {
      return res.status(500).json({ 
        error: 'Replicate API 토큰이 설정되지 않았습니다.',
        details: 'REPLICATE_API_TOKEN 환경변수를 설정해주세요.'
      });
    }

    // 2초 대기 (안정성을 위해)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    console.log('Replicate 예측 생성:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Replicate API 오류:', error);
    res.status(500).json({ 
      error: 'AI 이미지 생성 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// Replicate 결과 polling 엔드포인트
app.get('/replicate/:id', async (req, res) => {
  try {
    if (!REPLICATE_API_TOKEN || REPLICATE_API_TOKEN === 'your-replicate-api-token-here') {
      return res.status(500).json({ 
        error: 'Replicate API 토큰이 설정되지 않았습니다.',
        details: 'REPLICATE_API_TOKEN 환경변수를 설정해주세요.'
      });
    }

    const response = await fetch(`https://api.replicate.com/v1/predictions/${req.params.id}`, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`
      }
    });

    const data = await response.json();
    console.log('Replicate 결과 폴링:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Replicate 폴링 오류:', error);
    res.status(500).json({ 
      error: '결과 확인 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 메인 페이지 라우트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 갤러리 페이지 라우트 (있는 경우)
app.get('/gallery', (req, res) => {
  const galleryPath = path.join(__dirname, 'gallery.html');
  if (require('fs').existsSync(galleryPath)) {
    res.sendFile(galleryPath);
  } else {
    res.redirect('/');
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log('🚀 AI Fitting Studio 서버가 포트', PORT, '에서 실행 중입니다.');
  console.log('📱 브라우저에서 http://localhost:' + PORT + ' 를 열어보세요.');
  
  if (!REPLICATE_API_TOKEN || REPLICATE_API_TOKEN === 'your-replicate-api-token-here') {
    console.log('⚠️  REPLICATE_API_TOKEN 환경변수를 설정해주세요.');
    console.log('   1. env.example 파일을 .env로 복사하세요');
    console.log('   2. .env 파일에서 REPLICATE_API_TOKEN을 실제 토큰으로 변경하세요');
    console.log('   3. Replicate 토큰은 https://replicate.com/account/api-tokens 에서 발급받을 수 있습니다');
  } else {
    console.log('✅ Replicate API 토큰이 설정되었습니다.');
  }
  
  console.log('✅ Cloudinary가 설정되었습니다.');
}); 