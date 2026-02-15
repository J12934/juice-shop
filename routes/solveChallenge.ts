/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import * as challengeUtils from '../lib/challengeUtils'
import { challenges } from '../data/datacache'
import { type ChallengeKey } from '../models/challenge'
import { type Request, type Response } from 'express'

export function solveChallenge () {
  return ({ params }: Request, res: Response) => {
    const key = params.key as ChallengeKey
    const challenge = challenges[key]

    if (challenge != null) {
      if (challenge.solved !== true) {
        challengeUtils.solve(challenge)
      }
      res.sendStatus(200)
    } else {
      res.sendStatus(404)
    }
  }
}
