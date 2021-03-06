*** Settings ***
Documentation     Test cases for Case Management
...               Run using "python web2py.py --no-banner -M -S eden -R applications/eden/tests/edentest_runner.py -A DRKCM"
Resource          ../../../../tests/implementation/resources/main.robot

*** Variables ***
${CASE URL}             ${BASEURL}/dvr/person

${OrgSelector}          pr_person_sub_dvr_case_organisation_id
${HRSelector}           pr_person_sub_dvr_case_human_resource_id
${IDField}              pr_person_pe_label
${FirstNameField}       pr_person_first_name
${LastNameField}        pr_person_last_name
${DoBField}             pr_person_date_of_birth
${GenderField}          pr_person_gender

${OrgName}              DRK Kreisverband Karlsruhe (DRK-KV KA)
${HRName}               Case Manager, KA

${CaseTextFilter}       person-pr_person_pe_label-pr_person_first_name-pr_person_middle_name-pr_person_last_name-dvr_case_comments-text-filter

*** Test Cases ***
Create Client
    Login To Eden If Not Logged In  ${VALID USER}  ${VALID PASSWORD}
    Open Page  ${CASE URL}/create
    Select From List By Label  ${OrgSelector}  ${OrgName}
    Select From List By Label  ${HRSelector}  ${HRName}
    Input Text  ${IDField}  987654
    Input Text  ${FirstNameField}  Jane
    Input Text  ${LastNameField}  Doe
    Input Text  ${DoBField}  1984-07-30
    Click Element  ${IDField}
    Select From List By Label  ${GenderField}  female
    # TODO: choose nationality
    # TODO: fill in resident status
    # TODO: add mobile form
    Submit CRUD Form
    Should Show Confirmation

Find Client By Name
    Login To Eden If Not Logged In  ${VALID USER}  ${VALID PASSWORD}
    Open Page  ${CASE URL}
    Input Text  ${CaseTextFilter}  Jane Doe
    Wait For Filter Result
    Should Give X Results  1
    DataTable Row Should Contain  1  ID  987654

Find Client By ID
    Login To Eden If Not Logged In  ${VALID USER}  ${VALID PASSWORD}
    Open Page  ${CASE URL}
    Input Text  ${CaseTextFilter}  987654
    Wait For Filter Result
    Should Give X Results  1
    DataTable Row Should Contain  1  First Name  Jane
    DataTable Row Should Contain  1  Last Name  Doe

Add Case Language Without Language
    Login To Eden If Not Logged In  ${VALID USER}  ${VALID PASSWORD}
    Open Page  ${CASE URL}
    Input Text  ${CaseTextFilter}  987654
    Wait For Filter Result
    Should Give X Results  1
    Click Edit In Row  1
    Location Should Contain  update
    Select From List By Label  sub_defaultcase_language_defaultcase_language_i_language_edit_none  ${EMPTY}
    Input Text  sub_defaultcase_language_defaultcase_language_i_comments_edit_none  SomeComment
    Click Element  css:div#add-defaultcase_language-none
    Wait Until Page Contains Element  read-row-defaultcase_language-0
    Submit CRUD Form
    Should Show Confirmation
    Click Element  css:a#edit-btn
    Element Should Contain  sub_defaultcase_language_defaultcase_language_i_language_read_0__row  -
