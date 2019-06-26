import { check } from "meteor/check";
import { BraintreeApi } from "./braintreeApi";
import Logger from "@reactioncommerce/logger";
import { PaymentMethodArgument } from "/lib/collections/schemas";

/**
 * @name braintreeSubmit
 * @method
 * @memberof Payment/Braintree/Methods
 * @summary Authorize, or authorize and capture payments from Braintree {@link https://developers.braintreepayments.com/reference/request/transaction/sale/node}
 * @param {Object} context The request context
 * @param {Object} input Input necessary to create a payment
 * @return {Object} results - Object containing the results of the transaction
 */
export function paymentSubmit(context, input) {
  const {
    amount,
    billingAddress,
    shopId,
    paymentData: {
      nonceToken
    }
  } = input;

  const paymentSubmitDetails = {
    amount: Number(amount),
    billingAddress,
    shopId,
    paymentData: {
      nonceToken
    }
  };

  let result;

  try {
    const paymentSubmitResult = BraintreeApi.apiCall.paymentSubmit(paymentSubmitDetails);
    Logger.debug(paymentSubmitResult);
    result = paymentSubmitResult;
  } catch (error) {
    Logger.error(error);
    result = {
      saved: false,
      error: `Cannot Submit Payment: ${error.message}`
    };
    Logger.fatal("Braintree call failed, payment was not submitted");
  }

  return result;
}


/**
 * @name braintree/payment/capture
 * @method
 * @memberof Payment/Braintree/Methods
 * @summary Capture payments from Braintree {@link https://developers.braintreepayments.com/reference/request/transaction/submit-for-settlement/node}
 * @param {Object} context The request context
 * @param {Object} paymentMethod - Object containing everything about the transaction to be settled
 * @return {Object} results - Object containing the results of the transaction
 */
export function paymentCapture(context, paymentMethod) {
  // Call both check and validate because by calling `clean`, the audit pkg
  // thinks that we haven't checked paymentMethod arg
  check(paymentMethod, Object);
  // PaymentMethodArgument.validate(PaymentMethodArgument.clean(paymentMethod));

  const paymentCaptureDetails = {
    transactionId: paymentMethod.transactionId,
    amount: paymentMethod.amount
  };

  let result;

  try {
    const paymentCaptureResult = BraintreeApi.apiCall.captureCharge(paymentCaptureDetails);
    Logger.debug(paymentCaptureResult);
    result = paymentCaptureResult;
  } catch (error) {
    Logger.error(error);
    result = {
      saved: false,
      error: `Cannot Capture Payment: ${error.message}`
    };
    Logger.fatal("Braintree call failed, payment was not captured");
  }

  return result;
}


/**
 * @name braintree/refund/create
 * @method
 * @memberof Payment/Braintree/Methods
 * @summary Refund BrainTree payment {@link https://developers.braintreepayments.com/reference/request/transaction/refund/node}
 * @param {Object} context The request context
 * @param {Object} paymentMethod - Object containing everything about the transaction to be settled
 * @param {Number} amount - Amount to be refunded if not the entire amount
 * @return {Object} results - Object containing the results of the transaction
 */
export function createRefund(context, paymentMethod, amount) {
  check(amount, Number);

  // Call both check and validate because by calling `clean`, the audit pkg
  // thinks that we haven't checked paymentMethod arg
  check(paymentMethod, Object);
  // PaymentMethodArgument.validate(PaymentMethodArgument.clean(paymentMethod));

  const refundDetails = {
    transactionId: paymentMethod.transactionId,
    amount
  };

  let result;

  try {
    const refundResult = BraintreeApi.apiCall.createRefund(refundDetails);
    Logger.debug(refundResult);
    result = refundResult;
  } catch (error) {
    Logger.error(error);
    result = {
      saved: false,
      error: `Cannot issue refund: ${error.message}`
    };
    Logger.fatal("Braintree call failed, refund was not issued");
  }

  return result;
}


/**
 * @name braintree/refund/list
 * @method
 * @memberof Payment/Braintree/Methods
 * @summary List all refunds for a transaction {@link https://developers.braintreepayments.com/reference/request/transaction/find/node}
 * @param {Object} paymentMethod - Object containing everything about the transaction to be settled
 * @return {Array} results - An array of refund objects for display in admin
 */
export function listRefunds(context, paymentMethod) {
  check(paymentMethod, Object);

  const refundListDetails = {
    transactionId: paymentMethod.transactionId
  };

  let result;

  try {
    const refundListResult = BraintreeApi.apiCall.listRefunds(refundListDetails);
    Logger.debug(refundListResult);
    result = refundListResult;
  } catch (error) {
    Logger.error(error);
    result = {
      saved: false,
      error: `Cannot list refunds: ${error.message}`
    };
    Logger.fatal("Braintree call failed, refunds not listed");
  }

  return result;
}
