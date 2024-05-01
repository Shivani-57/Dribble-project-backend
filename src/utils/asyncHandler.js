export const asyncHandler =(fn) => async(req,res,next)=>{
    try{
        console.log("In async try")
        await fn(req,res,next);
    }
    catch(err){
        console.log("In async catch")
        console.log(err)
        console.log(err.APIError)
        return next(err)
    }
}