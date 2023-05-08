import { ObjectId } from "mongodb";
import db from "../config/database.js";
import dayjs from "dayjs";

export async function postVote (req,res){
  const { id } = req.params;
  let currentDate = dayjs();
  let date= currentDate.format("YYYY-MM-DD HH:mm");
  let choice= await db.collection("choices").findOne({_id:  ObjectId(id)});
  if (choice) {
      let poll = await db.collection("polls").findOne({_id:  ObjectId(choice.pollId)});
      const timestamp = dayjs(poll.expireAt).toDate().getTime();
      if (poll && currentDate < timestamp){
          try{
            let vote = await db.collection("votes").insertOne({createdAt: date, choiceId:  ObjectId(id)});
            return res.sendStatus(201).send(vote);
          } catch(err){
              console.log(err.message)
          }
      }
      else{
          return res.sendStatus(403)
      }
  }
  else{
      return res.sendStatus(404)
  }
}

export async function getChoices( req, res) {
  const {id}= req.params;
  let poll= await db.collection("polls").findOne({_id: ObjectId(id)})
  if (!poll){
      return res.sendStatus(404)
  }
  else{
      try{
          let choices= await db.collection("choices").find({pollId :  ObjectId(id)}).toArray();
          return res.status(200).send(choices);
      } catch(err){
        console.log(err.message);
      }
  }
}

export async function postChoice(req,res){
  const { title, pollId }= req.body;
  let currentDate = dayjs().toDate().getTime();

  let poll = await db.collection("polls").findOne({_id:  ObjectId(pollId)});


  if(!poll){
      return res.sendStatus(404);
  }
  else{
      const timestamp = dayjs(poll.expireAt).toDate().getTime()
      let name = await db.collection("choices").findOne({title: title});
      if(name){
      return res.sendStatus(409);
      }
      else if(currentDate > timestamp) {
        return res.sendStatus(403);
      }
      else {
        try {
          await db.collection("choices").insertOne({title: title, pollId: ObjectId(pollId)});
          let choice= await db.collection("choices").findOne({title: title});
          return res.status(201).send(choice);
        } catch(err) {
            console.log(err.message);
        }
      }

  }

}