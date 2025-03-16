//"use server";
//import {
//  User,
//  getUserByStxAddress,
//  NewUser,
//  createUser,
//} from "../services/users";

//export async function fetchUserByAddress(
//  stxAddress: string,
//): Promise<User | null> {
//  try {
//    return await getUserByStxAddress(stxAddress);
//  } catch (error) {
//    console.error("Error fetching user by address:", error);
//    throw new Error("Failed to fetch user");
//  }
//}

//export async function createNewUser(data: NewUser): Promise<User> {
//  try {
//    return await createUser(data);
//  } catch (error) {
//    console.error("Error creating new user:", error);
//    throw new Error("Failed to create user");
//  }
//}

//export async function updateUserProfile(
//  userId: string,
//  data: Partial<NewUser>,
//): Promise<User | null> {
//  try {
//    // return await updateUser(userId, data);
//    console.log("Update user profile:", userId, data);
//    return null; // Replace with actual implementation
//  } catch (error) {
//    console.error("Error updating user profile:", error);
//    throw new Error("Failed to update user profile");
//  }
//}
