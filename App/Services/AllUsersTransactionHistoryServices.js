'use strict';

const mongoose = require('mongoose');
const Model = mongoose.model('allUsersTransactionHistory');
module.exports = {
  getByData: async function (data, select, setOption, sort) {
    try {
      return await Model.find(data, select, setOption).lean(); // setOption(sort, limit,skip)
      //   limit(length).skip(start).sort(sort)
    } catch (err) {
      console.log('AllUsersTransactionHistoryServices Error in getByData', err);
      return new Error(err);
    }
  },

  getDataCount: async function (query) {
    try {
      return await Model.countDocuments(query);
    } catch (err) {
      console.log('AllUsersTransactionHistoryServices Error in getDataCount : ', err);
      return new Error(err);
    }
  },

  getSingleData: async function (data, select, setOption) {
    try {
      return await Model.findOne(data, select, setOption);
    } catch (err) {
      console.log('AllUsersTransactionHistoryServices Error in getSingleData', err);
      return new Error(err);
    }
  },

  getById: async function (id, select) {
    try {
      return await Model.findById(id, select);
    } catch (err) {
      console.log('AllUsersTransactionHistoryServices Error in getById', err);
      return new Error(err);
    }
  },

  insertData: async function (data) {
    try {
      return await Model.create(data);
    } catch (err) {
      console.log('AllUsersTransactionHistoryServices Error in insertData', err);
      return new Error(err);
    }
  },

  deleteData: async function (data) {
    try {
      return await Model.deleteOne({ _id: data });
    } catch (err) {
      console.log('AllUsersTransactionHistoryServices Error in deleteData', err);
      return new Error(err);
    }
  },

  updateData: async function (condition, data) {
    try {
      return await Model.update(condition, data);
    } catch (err) {
      console.log('AllUsersTransactionHistoryServices Error in updateData', err);
      return new Error(err);
    }
  },

  aggregateQuery: async function (data) {
    try {
      return await Model.aggregate(data);
    } catch (err) {
      console.log('AllUsersTransactionHistoryServices Error in updateData', err);
      return new Error(err);
    }
  },

  aggregateQueryCount: async function (data) {
    try {
      return await Model.aggregate(data).toArray().length;
    } catch (e) {
      console.log('AllUsersTransactionHistoryServices Error in aggregateQueryCount', e );
      return new Error(e);
    }
  },

  getPopulatedData: async function (query, populateWith) {
    try {
      return await Model.find(query).populate(populateWith);
    } catch (e) {
      console.log(
        'AllUsersTransactionHistoryServices Error in getPopulatedData',
        e
      );
      return new Error(e);
    }
  },

  getDataAggregate: async function (query, length, start, sort) {
    try {
      return await Model.find(query)
        .sort(sort)
        .skip(start)
        .limit(length)
        .lean();
    } catch (error) {
      console.log('ChipsServices Error in getData : ' + error);
      return new Error(error);
    }
  },
};
