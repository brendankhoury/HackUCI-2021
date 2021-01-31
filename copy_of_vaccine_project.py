from flask import Flask, request, redirect
from twilio.twiml.messaging_response import MessagingResponse
from collections import namedtuple

clientInformation = namedtuple('clientInformation', 'states age work living health')
app = Flask(__name__)


@app.route("/handle_sms", methods=['GET', 'POST'])
def incoming_sms():
    """Send a dynamic reply to an incoming text message"""
    # Get the message the user sent our Twilio number

    body = request.values.get('Body', None)
    resp = MessagingResponse()
    # Start our TwiML response
    if body:

        resp.message('Hi! Welcome to Vaccine Info Estimator, we are going to ask you a series of questions to determine'
                     'your estimated date to receive the vaccine. PRESS ANY KEY TO CONTINUE')
        # Determine the state
        resp.message('What states are you in? (First two letters of your state)')
        body = request.values.get('Body', None)
        states = body

        # Determine the age
    if body:
        resp.message('How old are you? Selection from the age groups below:')
        resp.message('A. 3 to 17')
        resp.message('B. 18 to 30')
        resp.message('C. 31 to 64')
        resp.message('D. 65 and older')

        body = request.values.get('Body', None)
        ages = body
    print(states,ages)

        # Determine the work

        resp.message('What profession are you?')
        resp.message('Are you in Group A? (Yes / No)')
        resp.message(
            'Ambulatory health care \n Assisted living \n Developmental disability facility \n Fire protection services \n Home healthcare services Hospital '
            'worker \n Nursing/residential care \n Outpatient care \n Pharmacy/drug store \n Physician/health practitioner \n Police')
        body = request.values.get('Body', None)

        if body.lower() == 'no' or body.lower() == 'n':
            resp.message('Are you in Group B? (Yes / No)')
            resp.message(
                'Community relief services \n Cosmetic/beauty supply store \n Day care \n Dentistry \n Food/drink production or store \n Gas station \n Health/personal care store \n Homeless shelter \n Medical/diagnostic lab \n '
                'Optical goods store \n Medicine production \n Postal service \n Prison/Jail \n School teaching \n Transportation \n Warehousing/storage')
            body = request.values.get('Body', None)

            if body.lower() == 'no' or body.lower() == 'n':
                resp.message('Are you in Group C? (Yes / No)')
                resp.message(
                    'Animal production/fishing \n Bars/Restaurants \n Clothing/accessories store \n Construction \n Credit intermediation \n Crop production \n '
                    'Hardware \n Mining \n Oil/gas extraction \n Specialty trade contractors \n Transport equipment production \n Utilities \n Waste management')
                body = request.values.get('Body', None)

                if body.lower() == 'no' or body.lower() == 'n':
                    work = 'no work'
                elif body.lower() == 'yes' or body.lower() == 'y':
                    work = body
                else:
                    work = 'invalid'


            elif body.lower() == 'yes' or body.lower() == 'y':
                work = body
            else:
                work = 'invalid'

        elif body.lower() == 'yes' or body.lower() == 'y':
            work = body
        else:
            work = 'invalid'

        while work == 'invalid':
            resp.message('Please specify your group: A, B, or C')
            body = request.values.get('Body', None)
            work = body

        # Determine the living condition
        resp.message('What is your living situation?')
        resp.message('A. Nursing home/residential care \n B. Home with more people than rooms \n C. Homeless shelter '
                     '\n D. Prison/Jail \n E. Group home \n F. Rehab center \n G. None of these')
        body = request.values.get('Body', None)
        living = body

        options = {'A', 'B', 'C', 'D', 'E', 'F', 'G'}
        while living.upper() not in options:
            resp.message('Please choose your living category, A-G')
            body = request.values.get('Body', None)
            living = body

        # Determine the health condition
        resp.message('Do you have any health conditions?')
        resp.message(
            'A. Obesity \n B. COPD (Chronic obstructive pulmonary disease) \n C. Diabetes \n D. Heart disease \n E. Chronic kidney disease \n F. None of these')

        body = request.values.get('Body', None)
        health = body

        health_options = {'A', 'B', 'C', 'D', 'E', 'F'}
        while health.upper() not in health_options:
            resp.message('Please choose your living category, A-F')
            body = request.values.get('Body', None)
            health = body

        client = clientInformation(states, ages, work, living, health)

        # Connection to model for decision

        resp.message('Undetermined for now, model not connected')

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