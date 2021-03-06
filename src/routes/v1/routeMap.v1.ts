import { Router, Request, Response } from 'express';

import ApiURL from '@models/ApiURL';
import * as AdminAction from './adminAction';
import * as DefinitionAction from './definitionAction';
import * as UserAction from './userAction';
import * as VoteAction from './voteAction';
import HttpMethod from '@constants/HttpMethod';
import * as CommentAction from './commentAction';

export default [
  {
    action: CommentAction.getComments,
    method: HttpMethod.GET,
    path: ApiURL.COMMENTS,
  },
  {
    action: CommentAction.postComment,
    method: HttpMethod.POST,
    path: ApiURL.COMMENT,
  },
  {
    action: DefinitionAction.postDefinitions,
    method: HttpMethod.POST,
    path: ApiURL.DEFINITIONS,
  },
  {
    action: DefinitionAction.postDefinitionsDefinitionid,
    method: HttpMethod.POST,
    path: ApiURL.DEFINITIONS_$DEFINITIONID,
  },
  {
    action: DefinitionAction.postDefinitionNew,
    method: HttpMethod.POST,
    path: ApiURL.DEFINITION_NEW,
  },
  {
    action: AdminAction.postAdminSeed,
    method: HttpMethod.GET,
    path: ApiURL.ADMIN_SEED,
  },
  {
    action: UserAction.postUserNew,
    method: HttpMethod.POST,
    path: ApiURL.USER_NEW,
  },
  {
    action: UserAction.postSessionNew,
    method: HttpMethod.POST,
    path: ApiURL.SESSION_NEW,
  },
  {
    action: VoteAction.upVote,
    method: HttpMethod.POST,
    path: ApiURL.VOTE_UP,
  },
  {
    action: VoteAction.downVote,
    method: HttpMethod.POST,
    path: ApiURL.VOTE_DOWN,
  },
];
