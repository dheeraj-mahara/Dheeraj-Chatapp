import jwt from "jsonwebtoken"

// -=-=================== cheaklogin login    -=====-=====-=-====-


export const cheaklogin = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect("/auth/login");
  }

  try {
    const data = jwt.verify(
      token,
      "84u89wuenxue98yenyxeuxew8u9y475y7yrnyx4t843"
    );
    req.user = data;
    next();
  } catch (err) {
    return res.redirect("/auth/login");
  }
};



