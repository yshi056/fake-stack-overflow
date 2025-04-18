[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/aJ_a2Ddi)
# CS5500 Final Team Project

The team project has four parts -- __proposal__, __implementation__, __checkpoint__, and __presentation__. Each of the sections is described below. Pay attention to the due dates and deliverables for each section.

## Project Proposal

### Due Date

**Saturday, March 22, 2024 at 11:59 PM**

### Things To Do

1. Define at least three distinct functional requirements you want to implement to extend the fake stack overflow app. Recall functional requirements correspond to things a user can do on
the application. In the past, students have added the following features. You can use these features for ideas but are not limited to them. Feel free to use your imagination to develop the proposed feature set.
    - Allow users to create accounts, manage their accounts, and their activity.
    - Content moderation mechanisms.
    - Automatically infer post tags/themes from the post content.
    - Commenting posts.
    - Voting on posts.
    - Improve the user interface using Material UI.
    - Allow users to rate posts and accept answers to a question.
    - Help users earn badges and reputation points.
    - Allowing users with similar interests and values to create communities.
    - A bot that creates automatic answers to questions posed, subject to admin verification.

2. Define at least one non-functional requirement. Recall a non functional requirement is not something that the user can do but affects usability of the application. In the past students have added the following non functional requirements:
    - Improve the user interface using [Material UI](https://mui.com/material-ui/?srsltid=AfmBOoomjVX_ZrNimNlJzkrHVMwd9j5lshNgdP9rB59Sz0CFp6GhF7Ne).
    - Improve [accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/What_is_accessibility) so it is accessible to all kinds of users.
    - Improve the performance of the application using server-side caching or pagination.
    - Refactor the design of the React client by introducing [React routing](https://reactrouter.com/) or [context](https://react.dev/learn/passing-data-deeply-with-context) and [reducers](https://react.dev/learn/extracting-state-logic-into-a-reducer).
    - Define an alternative arcitecture using architectural patterns such as microservices.

3. For each functional requirement, define the requirements as user stories. At the very least each feature should have a user story. There is no limit on the number of user stories.

    Each user story must be defined as an issue in GitHub and have the following format:
    ```
        Feature: feature name
        Context: The socio-historical context for the proposed feature
        Description: As a `user` I want to `action` so that I can `goal`
        Scenarios: Acceptance criteria defined as `Given When Then` scenarios.
    ```
    The `goal` of the feature description must accurately reflect the values you want to embed into the design of your application. 

    The acceptance criteria must describe both valid cases and error cases for full credit.
    
    The user stories should represent the minimal viable product (MVP). An MVP is a basic version of a product that can be released for feedback. You can go beyond the defined user stories in the final project. However, you will be graded based on the user stories you define in the proposal. Minor changes to user stories will be allowed in the final submission.

    A non-functional requirement must be defined as a GitHub issue in the following format:

    ```
        Description: one line description of the requirment.
        Goal: What is the purpose?
        Enablers: A list of exploratory and technical enablers required to implement the requirement.
        Acceptance Scenario: A list of measurable items that will indicate that the requirement is complete. 
    ```

Review the module on user stories for reference.

### Deliverables

1. A list of issues in this repository's issues tab.
2. A GitHub Project with all issues listed as ToDos. 
3. The link to this repository in the Canvas assignment for project proposal.

### Grading

1. You will get full credit if your proposed features are approved. 
2. You will get no credit if your proposal is rejected.
3. Reasons for proposal rejection:
    - Failure to define three distinct functional requirements and one non functional requirement.
    - Failure to record requirements as GitHub issues.
    - Failure to create a GitHub Project.
    - Failure to comply with the given format.
    - The stories are not expressed in a measurable manner and are vaguely specified.

### Useful Additional Resourcess

You are encouraged to use the following resources to inform the design and specification of the proposed features.

__Bias__

- [Gender differences in participation and reward on Stack
Overflow](https://northeastern.instructure.com/courses/192460/files/29450826?module_item_id=10971180)

- [The Impact of Surface Features on Choice of (in) Secure Answers by Stackoverflow Readers](https://northeastern.instructure.com/courses/192460/files/29450818?module_item_id=10971179)

__Trust__

- [Understanding stack overflow code quality: A recommendation of caution](https://northeastern.instructure.com/courses/192460/files/29450809?module_item_id=10971178)
- [Stack overflow considered harmful? the impact of copy-paste on android application security](https://northeastern.instructure.com/courses/192460/files/29450857?module_item_id=10971185)
- [An Empirical Study of Obsolete Answers on Stack Overflow](https://northeastern.instructure.com/courses/192460/files/29450797?module_item_id=10971177)

__Socio-historical Contexts__

- [Understanding and evaluating the behavior of technical users. A study of developer interaction at StackOverflow](https://northeastern.instructure.com/courses/192460/files/29450856?module_item_id=10971184)
- [Is Stack Overflow Obsolete? An Empirical Study of the Characteristics of ChatGPT Answers to Stack Overflow Questions](https://northeastern.instructure.com/courses/192460/files/29450842?module_item_id=10971182)
- [Impact of individualism and collectivism cultural profiles on the behaviour of software developers: A study of stack overflow](https://northeastern.instructure.com/courses/192460/files/29451127?module_item_id=10971617)
- [Thank you for being nice: Investigating Perspectives Towards Social
Feedback on Stack Overflow](https://northeastern.instructure.com/courses/192460/files/29450788?module_item_id=10971176)

__Content Moderation__

- [The Content Quality of Crowdsourced Knowledge on Stack Overflow- A Systematic Mapping Study](https://northeastern.instructure.com/courses/192460/files/29450852?module_item_id=10971183)

__Hate Speech__

- [Norm Violation in Online Communities – A Study of Stack Overflow Comments](https://northeastern.instructure.com/courses/192460/files/29450834?module_item_id=10971181)


## Implementation

Read the project implementation details [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ESvUWM5hRrdFtAz4JMNmMrUBfbrd3eQhaaatKM9jXiihEA?e=WSVv3r).

**Final Project Due Date: Friday, April 18, 2024 at 11:59 PM**

### Final Project Checkpoint

You are expected to submit a pull request (PR) for review. The course staff will review the pull request and provide actionable feedback. We expect that you will have addressed concerns and comments raised in the reviewed PR in the final project submission. In the pull request comments you must describe which requirements you have worked on thus far. The best way to describe this is reference the user story in the comment and list the acceptance criteria that have been met and the ones that are remaining.

**Checkpoint Due Date: Saturday, April 5, 2024**

Submit your team's GitHub URL in Canvas.

### Final Project Submission Checklist

See grading section in the project implementation description document (link above). Additonally you must submit the following:

- This repository's link in the Canvas assignment for final project. 
- A **README-instructions.md** file with the following:
    - Instructions to test the deployed application on Render
    - Instructions to run the jest and cypress test cases.
    - Instructions to generate the coverage report for jest tests.
    - Instructions to generate the CodeQL report for your application's server.
    - Instructions to set environment variables that one may need to run any scripts or tests.
- Submit the [peer-evaluation survey](https://forms.gle/HF2Uk7bWwgq4rmXn7).
- Any additional information (if any) about your implemention that you would like to inform the grader should be documented in **README-misc.md**.

## Presentation

Read the the expectations of the final presentation [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/EUv2QWu7yMdIuf9xz6vf9K4BkZvC95lbwezneVYD-Uw4Yg?e=YrRVFM). In the same document you will find a link to schedule your final presentation. **You must select a time slot between Apr 22 - Apr 25**. The presentation will be online. Carefully read the instructions before scheduling the presentation.

### Deliverable
- Presentation slides in the Canvas assignment for the final project presentation.