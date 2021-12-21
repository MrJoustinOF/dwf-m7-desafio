import { User } from "./User";
import { Pet } from "./Pet";

// Here comes the associations
User.hasMany(Pet);
Pet.belongsTo(User);

// Export Models again
export { User, Pet };
