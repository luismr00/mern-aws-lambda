const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_6GHLOIR17", // replace with your user pool ID
  tokenUse: "id",
  clientId: "3qn8h4m1q417e8hfvvh6fplvbb", // replace with your user pool web client ID
});

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token is missing or invalid" });
  }

  try {
    const payload = await verifier.verify(token);
    req.user = payload;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Access token is missing or invalid" });
  }
};

module.exports = authenticateToken;
