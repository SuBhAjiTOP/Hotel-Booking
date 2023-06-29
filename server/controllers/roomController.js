import cloudinary from "cloudinary";
import roomModel from "../models/roomModel.js";

export const addRooms = async (req, res) => {
  try {
    console.log(req.body);
    const { name, bedsize, capacity, services, description, price } = req.body;

    const results = [];
    if (req.files && req.files.images) {
      for (let i = 0; i < req.files.images.length; i++) {
        const imageData = await cloudinary.v2.uploader.upload(
          req.files.images[i].tempFilePath,
          {
            folder: "HotelRooms",
          }
        );

        results.push(imageData.secure_url);
      }
    }

    const room = new roomModel({
      name,
      bedsize,
      capacity,
      services,
      description,
      price,
      images: results,
    });
    await room.save();
    return res
      .status(200)
      .json({ status: true, message: "Rooms data uploaded successfully!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .json({ status: false, message: "Internal Server Error!!!" });
  }
};


//getting all rooms api
export const getAllRooms=async(req,res)=>{
  try{
    let rooms=await roomModel.find({});
    return res.status(200)
    .json({
      status:true,
      message:"Get All Data Successfully!!",
      rooms
    })
  }
  catch(error)
  {
    return res.status(500)
    .json({
      status:false,
      message:"Internal Server Error!!"
    })
  }
}


//edit a room by its roomId
export const editRoomById=async(req,res)=>{
  const id=req.body.RoomId;
  try{
     let updatedRoom=await roomModel.findByIdAndUpdate(id,
        req.body
     )
     await updatedRoom.save();
     return res.status(200)
     .json({
      status:true,
      message:"Rooms data Updated Successfully!!",
      updatedRoom
     })
  }
  catch(error)
  {
    return res.status(500)
    .json({
      status:false,
      message:"Internal Server Error!!"
    })
  }
}

//getting room by id
export const getRoomById=async(req,res)=>{
  const roomId=req.body.roomId;
  try{
     let roomDetails=await roomModel.findOne({_id,roomId});
     return res.status(200)
     .json({
      status:true,
      message:"Details get successfully!!",
      roomDetails
     })
  }
  catch(error)
  {
    console.log(error);
    return res.status(200)
    .json({
      status:false,
      message:"Internal Server Error"
    })
  }
}