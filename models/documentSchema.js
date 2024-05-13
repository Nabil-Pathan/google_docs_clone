import mongoose from "mongoose";

const DocumentSchema = new  mongoose.Schema({
    _id : String,
    data : Object
})

const Document = mongoose.model("Document",DocumentSchema)

export default Document