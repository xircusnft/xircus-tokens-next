export default function validateToken(token) {
  if (token && token.startsWith("0x") && token.length == 42) return true;

  return false;
}
