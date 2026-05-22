//  app.get('/update', async (req, res) => {

//   let updateImage = await imageModel.findOneAndUpdate(
//     { type: '2pm' }, // filter
//     {
//       imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy1NiZ172nBp80sbhLu8LjwWdk905tF_RSHg&s"
//     },
//     { new: true } // 👉 return updated data
//   );

//   res.send(updateImage);
// });
// app.get('/read',async (req,res)=>{
//   let images = await imageModel.find();
//   res.send(images)
// })
// app.get('/delete',async (req,res)=>{
//   let deletedImages = await imageModel.findOneAndDelete({type:'2pm'})
//   res.send(deletedImages)
// })
// routes