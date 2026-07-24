async function test() {
  try {
    const res = await fetch('http://localhost:3002/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test_student_' + Date.now() + '@example.com',
        password: 'password123',
        role: 'STUDENT',
        fullName: 'Test Student',
        phone: '+1234567890',
        country: 'USA',
        timezone: 'UTC'
      })
    });
    const data = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch(e) {
    console.error(e);
  }
}
test();
