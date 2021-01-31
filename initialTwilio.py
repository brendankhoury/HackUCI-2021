from flask import Flask, request, redirect
from twilio.twiml.messaging_response import MessagingResponse

app = Flask(__name__)


user_info = dict()

@app.route("/handle_sms", methods=['GET', 'POST'])
def incoming_sms():
    """Send a dynamic reply to an incoming text message"""
    # Get the message the user sent our Twilio number
    body = request.values.get('Body', None)

    # Start our TwiML response
    resp = MessagingResponse()

    phone_number = request.values.get('From')

    if phone_number in user_info:
        if user_info[phone_number][-1] == 0:
            #check the validity of the state
            user_info[phone_number][0] = body
            resp.message('How old are you? Selection from the age groups below:')
            resp.message('A. 3 to 17')
            resp.message('B. 18 to 30')
            resp.message('C. 31 to 64')
            resp.message('D. 65 and older')
            user_info[phone_number][-1] += 1
        elif user_info[phone_number][-1] == 1:
            #check the validity of the age
            user_info[phone_number][1] = body
            resp.message('What profession are you?')
            resp.message('Are you in Group A? (Yes / No)')
            resp.message('Ambulatory health care \n Assisted living \n Developmental disability facility \n Fire protection services \n Home healthcare services Hospital '
                'worker \n Nursing/residential care \n Outpatient care \n Pharmacy/drug store \n Physician/health practitioner \n Police')
            user_info[phone_number][-1] += 1
        elif user_info[phone_number][-1] == 2:
            #check the validity of the profession
            user_info[phone_number][2] = body
            resp.message('What is your living situation?')
            resp.message(
                'A. Nursing home/residential care \n B. Home with more people than rooms \n C. Homeless shelter '
                '\n D. Prison/Jail \n E. Group home \n F. Rehab center \n G. None of these')
            user_info[phone_number][-1] += 1
        elif user_info[phone_number][-1] == 3:
            #check the validity of the living condition
            user_info[phone_number][3] = body
            resp.message('Do you have any health conditions?')
            resp.message('A. Obesity \n B. COPD (Chronic obstructive pulmonary disease) \n C. Diabetes \n D. Heart disease \n E. Chronic kidney disease \n F. None of these')
            user_info[phone_number][-1] += 1
        elif user_info[phone_number][-1] == 4:
            #check the validity of the health condition
            user_info[phone_number][4] = body
            resp.message('This is the end of the message.')
    else:
        resp.message('Hi! Welcome to Vaccine Info Estimator, we are going to ask you a series of questions to determine'
                     'your estimated date to receive the vaccine. What state are you in?')
        current_counter = 0
        user_info[phone_number] = [None, None, None, None, None, current_counter]

    print(user_info)
#----------------------------------------------------------------------------

    return str(resp)

if __name__ == "__main__":
    app.run(debug=True)

# twilio phone-numbers:update PNe2a30ea94813c69a9856573f9a7e3b7d --sms-url http://localhost:5000/handle_sms


# from flask import Flask, request, redirect
# from twilio.twiml.messaging_response import MessagingResponse
#
# app = Flask(__name__)
#
# @app.route("/handle_sms", methods=['GET', 'POST'])
# def incoming_sms():
#     """Send a dynamic reply to an incoming text message"""
#     # Get the message the user sent our Twilio number
#     body = request.values.get('Body', None)
#
#     # Start our TwiML response
#     resp = MessagingResponse()
#
#     # Determine the right reply for this message
#     if body:
#         resp.message('Hi! Welcome to Vaccine Info Estimator, we are going to ask you a series of questions to determine'
#                      'your estimated date to receive the vaccine.')
#
#
#     return str(resp)
#
# if __name__ == "__main__":
#     app.run(debug=True)