const { Router, Request: Request_, Response: Response_, NextFunction } = require('express');
const { Client } = require('pg');
const {
  addNewLineSQL, selectSingleUserSQL,
  changeValueOneCellSQL, selectOneParamQSL,
  changeValueAllCellSQL, changeEmailSQL, dropTableLineSQL
} = require('../sql-functions/index');
const { clients } = require('../clients');
const { getCookie } = require('../getCookies');
const { checkerDubleEmails } = require('../validators');
const log_ = require('../logs/index');
const REACT_APP_POSTGRES_HOST = (process.env.REACT_APP_POSTGRES_HOST as string | unknown) || 'localhost';
const REACT_APP_POSTGRES_PORT = (process.env.REACT_APP_POSTGRES_PORT as string | unknown) || '5432';
const REACT_APP_POSTGRES_DB_NAME = (process.env.REACT_APP_POSTGRES_DB_NAME as string | unknown) || 'london';
const REACT_APP_POSTGRES_USER = (process.env.REACT_APP_POSTGRES_USER as string | unknown) || 'postgres';
const REACT_APP_POSTGRES_DB_PASS = (process.env.REACT_APP_POSTGRES_DB_PASS as string | unknown) || '123';

interface propsForClient {
  readonly email: string
  readonly firstName?: string
  readonly lastName?: string
  readonly passwords: string
  password?: string
  cookie?: { sessionId: string }
};
export function routerClientsAds(routers: typeof router): typeof router {
  return routers;
};
