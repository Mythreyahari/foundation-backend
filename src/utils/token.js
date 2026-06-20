import jwt from 'jsonwebtoken'

export function createToken(volunteerId) {
  return jwt.sign({ volunteerId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}
