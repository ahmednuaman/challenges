/* global angular, expect */
/* eslint-env mocha */

import { MODULE_NAME } from 'module'
import 'service/data'

describe('service/data', () => {
  beforeEach(angular.mock.module(MODULE_NAME))

  describe('dataService', () => {
    it('should have a loadData method', angular.mock.inject((dataService) => {
      expect(dataService.loadData).toBeTruthy()
    }))

    it('should load data', angular.mock.inject(($httpBackend, dataService) => {
      $httpBackend
        .expectGET('/data.json')
        .respond(201)

      dataService.loadData()

      $httpBackend.flush()
      $httpBackend.verifyNoOutstandingExpectation()
      $httpBackend.verifyNoOutstandingRequest()
    }))
  })
})
