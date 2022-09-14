import express from 'express';
import { PrismaClient } from '@prisma/client';
import {convertMin} from './utils/convertMin';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient({
  log: ['query']
});

app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });

  return res.json(games);
});

app.post('/games/:id/ads', async (req, res) => {

  const gameId = req.params.id;
  const body = req.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      minStart: convertMin(body.minStart),
      minEnd: convertMin(body.minEnd), 
      useVoice: body.useVoice, 
      createdAt: body.createdAt, 
    }
  })

  return res.status(201).json(ad);
});

app.get('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      createdAt: true,
      minEnd: true,
      minStart: true,
      useVoice: true
    },
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      gameId,
    },
  });
  
  return res.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      minStart: convertMin(String(ad.minStart)),
      minEnd: convertMin(String(ad.minEnd)),
    };
  }));
});

app.get('/ads/:id/discord', async (req, res) => {
  const adId = req.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });
  
  return res.json({
    discord: ad.discord,
  });
});

app.listen(3333);
