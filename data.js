data = {
  "swagger": "2.0",
  "info": {
    "version": "0.0.1",
    "title": "A simple API Gateway"
  },
  "host": "www.api.com:8000",
  "basePath": "/user-order/v1/",
  "schemes": [
    "http",
    "https"
  ],
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  "paths": {
    "/bookTo": {
      "x-swagger-router-controller": "ServiceController",
      "x-ID": "001",
      "x-name": "airlineBookTo",
      "get": {
        "description": "预订往航班机票",
        "deprecated": false,
        "tags": [
          "机票"
        ],
        "operationId": "airlineBookTo",
        "parameters": [
          {
            "name": "isBuy",
            "in": "query",
            "description": "机票购买是否成功，true为成功，false为失败",
            "required": false,
            "type": "boolean"
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": {
              "$ref": "#/definitions/ServiceResponse"
            }
          },
          "default": {
            "description": "Error",
            "schema": {
              "$ref": "#/definitions/ErrorResponse"
            }
          }
        }
      }
    },
    "/estimates/price": {
      "get": {
        "summary": "Price Estimates",
        "description": "The Price Estimates endpoint returns an estimated price range for each product offered at a given location. The price estimate is provided as a formatted string with the full price range and the localized currency symbol.<br><br>The response also includes low and high estimates, and the [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) currency code for situations requiring currency conversion. When surge is active for a particular product, its surge_multiplier will be greater than 1, but the price estimate already factors in this multiplier.",
        "parameters": [
          {
            "name": "start_latitude",
            "in": "query",
            "description": "Latitude component of start location.",
            "required": true,
            "schema": {
              "type": "number",
              "format": "double"
            }
          },
          {
            "name": "start_longitude",
            "in": "query",
            "description": "Longitude component of start location.",
            "required": true,
            "schema": {
              "type": "number",
              "format": "double"
            }
          },
          {
            "name": "end_latitude",
            "in": "query",
            "description": "Latitude component of end location.",
            "required": true,
            "schema": {
              "type": "number",
              "format": "double"
            }
          },
          {
            "name": "end_longitude",
            "in": "query",
            "description": "Longitude component of end location.",
            "required": true,
            "schema": {
              "type": "number",
              "format": "double"
            }
          }
        ],
        "tags": [
          "Estimates"
        ],
        "responses": {
          "200": {
            "description": "An array of price estimates by product",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/definitions/PriceEstimate"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "definitions": {
    "ServiceResponse": {
      "required": [
        "message"
      ],
      "properties": {
        "message": {
          "type": "string"
        }
      }
    },
    "ErrorResponse": {
      "required": [
        "message"
      ],
      "properties": {
        "message": {
          "type": "string"
        }
      }
    },
    "PriceEstimate": {
      "properties": {
        "product_id": {
          "type": "string",
          "description": "Unique identifier representing a specific product for a given latitude & longitude. For example, uberX in San Francisco will have a different product_id than uberX in Los Angeles"
        },
        "currency_code": {
          "type": "string",
          "description": "[ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) currency code."
        },
        "display_name": {
          "type": "string",
          "description": "Display name of product."
        },
        "estimate": {
          "type": "string",
          "description": "Formatted string of estimate in local currency of the start location. Estimate could be a range, a single number (flat rate) or \"Metered\" for TAXI."
        },
        "low_estimate": {
          "type": "number",
          "description": "Lower bound of the estimated price."
        },
        "high_estimate": {
          "type": "number",
          "description": "Upper bound of the estimated price."
        },
        "surge_multiplier": {
          "type": "number",
          "description": "Expected surge multiplier. Surge is active if surge_multiplier is greater than 1. Price estimate already factors in the surge multiplier."
        }
      }
    }
  }
}

const rep = {
  "method": "get",
  "uri": "/user-order/v1/bookTo",
  "mock": {
    "response": {
      "type": "object",
      "include": {
        "msg": {
          "type": "string"
        },
        "child": {
          "type": "object",
          "include": {
            "child_msg": {
              "type": "string"
            }
          }
        },
        "result": {
          "type": "object",
          "include": {
            "message": {
              "type": "string"
            },
            "data": {
              "type": "array",
              "include": {
                "type": "object",
                "include": {
                  "display_name": {
                    "type": "string"
                  },
                  "low_estimate": {
                    "type": "number",
                    "enum": [
                      1,
                      2,
                      3,
                      4,
                      5,
                      6,
                      7,
                      8,
                      9,
                      0
                    ]
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const arrdata = {
  "method": "get",
  "uri": "/user-order/v1/estimates/price",
  "mock": {
    "response": {
      "type": "array",
      "include": {
        "type": "object",
        "include": {
          "display_name": {
            "type": "string"
          },
          "low_estimate": {
            "type": "number",
            "enum": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              0
            ]
          }
        }
      }
    }
  }
}