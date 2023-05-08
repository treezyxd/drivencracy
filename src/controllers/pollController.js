import db from "../config/database.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function getResult(req,res){
  const { id }= req.params;

  try {
    const poll = await db.collection("polls").findOne({ _id: ObjectId(id) });
    if (poll) {

      const choices = db.collection("choices").find({pollId: ObjectId(poll._id)})

      for(let i = 0; i < choices.length; i++){

        let bigger = i;
        let option = choices[i];
        let votes = db.collection("votes").find({choiceId: ObjectId(option._id)});

        for(let j= i + 1; j<choices.length;j++){

            let option2 = choices[i];
            let votes2 = db.collection("votes").find({choiceId: ObjectId(option2._id)});

              if(votes2.length>votes.length){
                bigger = j;
              }
            }
            let aux = choices[i];
            choices[i] = choices[bigger];
            choices[bigger] = aux;
          }

          const winner= choices[0];

          const totalVotes = db.collection("votes").find({choiceId: ObjectId(winner._id)});

          const resultado = {
            _id: poll._id,
            title: poll.title,
            expireAt: poll.expireAt,
            result : {
                title: winner.title,
                votes: totalVotes.length
            }
          }

          return res.status(200).send(resultado);

    }
    else {
      return res.sendStatus(404);
    }
  } catch(err){
      console.log(err.message);
   }


}

export async function createPoll(req, res) {
  const { title, expireAt } = req.body;

  let currentDate = dayjs();
  let expires = currentDate + 2592000000; // 30 days in ms
  let date = expires.format("YYYY/MM/DD");

  if(expireAt === "" || !expireAt) {
    expireAt = date;
  }

  try {
    await db.collections('polls').insertOne({ title, expireAt });
    let poll = await db.collection('polls').findOne(title);
    return res.status(201).send(poll);
  } catch(err) {
    console.log(err.message);
    res.status(500);
  }
}

export async function getPolls(req, res) {
  try {
    res.send(await db.collection('polls').find().toArray());
  } catch(err) {
    console.log(err.message);
  }
}

