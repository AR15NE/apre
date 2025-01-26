'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * GET /call-duration-by-date-range
 * Fetches call duration data for agents within a specified date range.
 */
router.get('/call-duration-by-date-range', (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return next(createError(400, 'Start date and end date are required'));
    }

    console.log('Fetching call duration report for date range:', startDate, endDate);

    mongo(async db => {
      const data = await db.collection('agentPerformance').aggregate([
        {
          $match: {
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $lookup: {
            from: 'agents',
            localField: 'agentId',
            foreignField: 'agentId',
            as: 'agentDetails'
          }
        },
        {
          $unwind: '$agentDetails'
        },
        {
          $group: {
            _id: '$agentDetails.name',
            totalCallDuration: { $sum: '$callDuration' }
          }
        },
        {
          $project: {
            _id: 0,
            agent: '$_id',
            callDuration: '$totalCallDuration'
          }
        },
        {
          $group: {
            _id: null,
            agents: { $push: '$agent' },
            callDurations: { $push: '$callDuration' }
          }
        },
        {
          $project: {
            _id: 0,
            agents: 1,
            callDurations: 1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);
  } catch (err) {
    console.error('Error in /call-duration-by-date-range', err);
    next(err);
  }
});

/**
 * GET /agents
 * Fetches a list of agent names.
 */
router.get('/agents', async (req, res, next) => {
  try {
    await mongo(async db => {
      const agents = await db.collection('agents').find({}, { projection: { name: 1, _id: 0 } }).toArray();
      res.status(200).send(agents.map(agent => agent.name));
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /call-duration-by-agent
 * Fetches call duration data for agents.
 */
router.get('/call-duration-by-agent', async (req, res, next) => {
  try {
    await mongo(async db => {
      const data = await db.collection('agentPerformance').find().toArray();
      res.status(200).send(data);
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
