/*  
 *  Author: Colum Bennett <colum.bennett@feedhenry.com>
 *  Re-useable Angular service module using FeedHenry Hybrid API "$fh.cloud call.
 *  See developers docs, http://docs.feedhenry.com/
 */
angular.module('fhcloud', ['ngResource']).service("fhcloud", function($q) {

  return function(cloudEndpoint, data) {
    var defer = $q.defer();

    var params = {
      path: cloudEndpoint,
      method: "GET",
      contentType: "application/json",
      data: data,
      timeout: 15000
    };

    $fh.cloud(params, defer.resolve, defer.reject);

    return defer.promise;
  };
});