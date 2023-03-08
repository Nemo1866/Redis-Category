const express=require("express")
const app=express()
const redis=require("redis")
const redisClient=redis.createClient()

redisClient.connect()

redisClient.on("connect",()=>console.log("Connected"))
redisClient.on("error",(err)=>console.log(err))


app.use(express.json())

app.get("/",async(req,res)=>{
    try {
        let get=await redisClient.keys("*")

        res.send((get))
        
    } catch (error) {
        res.send("Some Error OCcured")
        console.log(error);
    }
   
})

app.post("/",async(req,res)=>{
    try {
        for(let i=0;i<50000;i++){
            let body={
                name:`A${i}`,
                class:`A`,
                company:`Audi`
            }
            await redisClient.setEx(`category ${i}`,1000,JSON.stringify(body))

        }
        
            res.send("Success")
    } catch (error) {
        res.send("Some Error Occured")
        console.log(error);
    }
   
 

})

app.get("/:id",async(req,res)=>{
    try {
        
        let result=await redisClient.get(`category ${req.params.id}`)
        if(!result){
            res.send("Record Not Found")
            return
        }
res.send(result)
    } catch (error) {
        res.send("Some Error Occured")
        console.log(error);
    }

})
app.put("/:id",async(req,res)=>{
    try {
        let body={
            name:req.body.name,
            class:req.body.class,
            company:req.body.company
        }
        let result=await redisClient.SET(`category ${req.params.id}`,JSON.stringify(body))
        if(!result){
            res.send("Record Can not be updated")
            return
        }
        res.send("Updated")
    } catch (error) {
        res.send("Some Error Occured")
        console.log(error);
    }
    
})
app.delete("/:id",async(req,res)=>{
    let result=await redisClient.DEL(`category ${req.params.id}`)
    if(!result){
        res.send("No Record Found")
        return
    }
    res.send("Deleted a record")
})

app.delete("/",async(req,res)=>{
    let result=await redisClient.flushAll()
    res.send("Deleted all the record")
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})