// const asyncHandler = (fn)=>{
//        async(err, req, res, next)=>{
//            try {
//                await fn(req,res,next);
//            }
//            catch (error) {
//                 console.error(error);
//                 res.status(error.code||500).json({sucess:false,message:"Server error"});
//            }
//        } 
// }

const asyncHandler = (fn)=>{
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };
};

export { asyncHandler};