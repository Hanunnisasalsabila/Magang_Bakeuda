import jwt from 'jsonwebtoken';

// Use proper fields expected by JwtStrategy (userId, not id_user)
const token = jwt.sign({ userId: 'desa', role: 'DESA', username: 'desa', kode_wilayah: '3303010001' }, 'pbb_bakeuda_123');

async function test() {
  const res = await fetch(`http://localhost:3000/api/transaksi-spop/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  console.log('STATUS STATS:', res.status);
  const text = await res.text();
  console.log('RESPONSE STATS:', text);
  
  const res2 = await fetch(`http://localhost:3000/api/transaksi-spop`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  console.log('STATUS LIST:', res2.status);
  const text2 = await res2.text();
  console.log('RESPONSE LIST:', text2.substring(0, 100));
}
test();
