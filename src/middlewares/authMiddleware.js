import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.js";
import { Staff } from "../models/staff.js";
import { Customer } from "../models/customer.js";

export const protect = (roles = []) => {
  if (typeof roles === "string") roles = [roles];

  return async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = null;
        if (decoded.role === "admin") user = await Admin.findById(decoded.id).select("-password");
        if (decoded.role === "staff") user = await Staff.findById(decoded.id).select("-password");
        if (decoded.role === "customer") user = await Customer.findById(decoded.id).select("-password");

        if (!user) return res.status(401).json({ message: "Not authorized" });

        // Role check
        if (roles.length && !roles.includes(decoded.role)) {
          return res.status(403).json({ message: "Access forbidden" });
        }

        req.user = user;
        next();
      } catch (error) {
        return res.status(401).json({ message: "Token invalid or expired" });
      }
    } else {
      return res.status(401).json({ message: "No token provided" });
    }
  };
};
