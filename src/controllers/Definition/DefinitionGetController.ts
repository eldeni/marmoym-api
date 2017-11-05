import db from '../../database';
import * as TermSelectDAO from '../../dao/Term/TermSelectDAO';
import * as UserSelectDAO from '../../dao/User/UserSelectDAO';
import * as DefinitionSelectDAO from '../../dao/Definition/DefinitionSelectDAO';
import * as PosSelectDAO from '../../dao/Pos/PosSelectDAO';
import * as UsageSelectDAO from '../../dao/Usage/UsageSelectDAO';
import * as OriginSelectDAO from '../../dao/Origin/OriginSelectDAO';
import MarmoymError from '../../models/MarmoymError';
import ErrorType from '../../models/ErrorType';
import { transaction } from '../../database/databaseUtils';
import { DefinitionResponse } from '../../routes/ResponseTypes';
import * as RequestTypes from '../../routes/RequestTypes';

export async function getDefinitionByDefIds(req: RequestTypes.GetDefinitions)
  : Promise<DefinitionResponse.Get> {
    
  let result: DefinitionResponse.Get = {
    terms: [],
    definitions: [],
    users: []
  };  

  let termIds = [];
  let userIds = [];

  const defSelected = await DefinitionSelectDAO.selectDefinitionsByIds(req.defIds);
  
  await Promise.all(defSelected.map(async defObj => {
    termIds = _appendIfNotPresent(termIds, defObj, 'term_id');
    userIds = _appendIfNotPresent(userIds, defObj, 'user_id');

    defObj.updated_at = defObj.updated_at.getTime();
    defObj.poss = await PosSelectDAO.selectPosByDefinitionId(defObj.id);
    defObj.usages = await UsageSelectDAO.selectUsageByDefinitionId(defObj.id);
    defObj.origins = await OriginSelectDAO.selectOriginByDefinitionId(defObj.id);

    result.definitions.push(defObj);
  }));

  const termSelected = await TermSelectDAO.selectTermByIds(termIds);
  termSelected.map(term => {
    term.updated_at = term.updated_at.getTime();
    result.terms.push(term);
  });

  result.users = await UserSelectDAO.selectUserByIds(userIds);
  return result;
}

export async function getRecentlyUpdatedDefinitionIds(req: RequestTypes.idGet) {
  const definitionIds = await DefinitionSelectDAO.selectIdsOfRecentlyAdded(req.offset, 10);
  await Promise.all(definitionIds.map(defObj => {
    defObj.updated_at = defObj.updated_at.getTime();
  }));
  return definitionIds;
}

export async function getDefinitionIdsBySearch(req: RequestTypes.Search) {
  const definitionIds = await DefinitionSelectDAO.selectIdsByTerm(req.query,0,10);
  await Promise.all(definitionIds.map(defObj => {
   defObj.updated_at = defObj.updated_at.getTime();
  }));
  return definitionIds;
}

function _appendIfNotPresent(arr, elem, key) {
  if (arr.indexOf(elem[key]) == -1) {
    arr.push(elem[key]);
  }
  return arr;
}