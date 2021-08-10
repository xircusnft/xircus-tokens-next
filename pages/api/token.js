// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log(req.body);
    res.status(200).json(req.body);
  } else {
    res.status(200).json({ post: 'no' });
  }
}
