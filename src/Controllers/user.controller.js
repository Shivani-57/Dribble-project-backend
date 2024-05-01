import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../Models/users.models.js"
import {uploadOnCloudinary} from '../utils/Cloudinary.js'

import { sendEmail } from "../utils/SendEmail.js";



const generateAccessAndRefreshToken = async (userId) => {
    console.log("In generat access and refresh token")
    try {
        const user = await User.findById(userId)
        console.log("generate access user",user)
        if (!user) {
            // throw new ApiError(404, "User not found")
            return res.status(404).send({message:"User not found"})
        }
        const accessToken = await user.generateAccessToken()
        console.log("access in generate",accessToken)
        const refreshToken = await user.generateRefreshToken()  
        console.log("refresh token in generate",refreshToken)

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {
            accessToken,
            refreshToken
        }

    }
    catch (error) {
        console.log(error)
        // throw new ApiError(500, "Something went wrong while generating token")
        return res.status(500).send({message:"Something went wrong while generating token"})
    }


}

const signUpUser = asyncHandler(async (req, res) => {
    
    const { name, username, email, password } = await req.body
    console.log("In signUpController", name, username, email, password)


    if (!name || !username || !email || !password) {
        console.log("All fields are required")
        // throw new ApiError(400, "All fields are required",res)
        return res.status(400).send({message:"all fields are required"})
    }

    const userEmailExist = await User.findOne({ email })
    if (userEmailExist) {
        console.log("Email already exist")

        // throw new ApiError(409, "Email already exist")
        return res.status(409).send({message:"Email already exist"})
    }
    const userNameExist = await User.findOne({ username })
    if (userNameExist) {
        console.log("Username already exist")
        // throw new ApiError(409, "Username already exist")
        return res.status(409).send({message:"Username already exist"})
    }

    const user = await User.create(
        {
            name,
            username,
            email,
            password
        }
    )

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if (!createdUser) {
        console.log("Something went wrong while registering user")
        // throw new ApiError(500, "Something went wrong while registering user")
        return res.status(500).send({message:"Something went wrong while registering user"})
    }

    console.log("User Registered successfully")
    return res.status(201).json(

        new ApiResponse(200, createdUser, "User Registered successfully")

    )
})


const signInUser = asyncHandler(async (req, res) => {
    console.log("In signIn user")
    const { email, password } = req.body

    if (!email || !password) {
        console.log("In all fields required")
        // throw new ApiError(400, "All fields are required")
        return res.status(400).send({ message: "All fields are required"})
    }

    const user = await User.findOne({ email })
    if (!user) {
        console.log("User not found")
        // throw new ApiError(404, "User not found")
        return res.status(404).send({ message: "User not found"})
    }
    console.log("user in controller",user)
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        // throw new ApiError(400, "Invalid Password")
        return res.status(400).send({ message: "Invalid Password"})
    }
    console.log(isPasswordValid)

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    console.log("access in controller",accessToken)
    console.log("refresh in controller",refreshToken)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    console.log("loggedIn user",loggedInUser)

    const options = {
        httpOnly: true,
        secure:true
    }

    console.log("acessToken",accessToken)
    console.log("RefreshToken",refreshToken)
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            { user: loggedInUser},
             "User Logged In successfully")
    )

})

const profilePageController = asyncHandler(async(req,res)=>{
    console.log("in profile page controller")
    console.log("req.body: ", req.body)
    const {location} = req.body
    console.log("in profilePageController")
    console.log("file",req.file)
    console.log("local path",req.file.path)
    if(!req.file){
        // throw new ApiError(400,"Profile Image is required")
        return res.status(400).send({message:"Profile Image is required"})
    }
    if(!location){
        // throw new ApiError(400,"Location is required")
        return res.status(400).send({message:"Location is required"})
    }
    
    console.log("user from jwt",req.user)
    const user = await User.findById(req.user._id)

    if(!user){
        // throw new ApiError(404,"User not found")
        return res.status(404).send({message:"User not found"})
    }

    const profileImageLocalPath = req.file.path
    const profileImageUrl = await uploadOnCloudinary(profileImageLocalPath)
    console.log("profileurl",profileImageUrl)

    user.location = location
    user.profileImage = profileImageUrl
    await user.save()
    const { password, refreshToken, ...updatedUser } = user.toObject();

    console.log("updated user", updatedUser);
    return res.status(200).json(
        new ApiResponse(200,
            { user: updatedUser},
             "Profile updated successfully")
    )
    
   
})


const welcomePageController = asyncHandler( async(req,res)=>{
    console.log("in welcomePageController")
    console.log("user from jwt",req.user)
    console.log("body ",req.body)
    const {role} = req.body
    console.log("role",role)
    const user = await User.findById(req.user._id)
    console.log("user",user)

    if(!user){
        // throw new ApiError(404,"User not found")
        return res.status(404).send({message:"User not found"})
    }
    user.selectedRole = role
    await user.save()
    console.log("user saved",user)
    const { password, refreshToken, ...updatedUser } = user.toObject();
    console.log("updatedUser",updatedUser)
    sendEmail(updatedUser.email)
    return res.status(200).json(
        new ApiResponse(200,
            { user: updatedUser},
             "Role updated successfully")
    )
})

export { signUpUser, signInUser ,profilePageController, welcomePageController}