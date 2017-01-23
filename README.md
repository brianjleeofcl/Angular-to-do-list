# Remembify
#### Galvanize: Web Development Immersive - Quarter 2 Project
#### Developers: Brian Lee, Michael Friedman

## Description

[Remembify](https://remembify.herokuapp.com/) is a general-purpose to-do list application that is designed for any current web-accessible device. By emphasizing a small number of core features, the application is flexible and adaptable for anyone.

## Features

### Sign-up and logging in

Users can register

![Sign-up page](/readme/signup.png)

After signing up, users may log in using their email address and password. Users will remained logged in for 120 days as default.

![Log-in page](/readme/login.png)

### Main list

After logging in, users are shown the main list which contains all previously saved tasks. Tasks are divided into current to-do tasks and completed tasks.

![Main](/readme/main.png)

##### Adding new task items

To add new tasks, enter the task in the input field and submit by pressing the enter key or clicking the add button next to the field.

![Adding task](/readme/addnewtask.gif)

##### Adding tags

Tags, which can be used for organizing tasks as well as sharing tasks, can be added while adding new tags.

Clicking on the 'Click to add tags' link will add a secondary input field; tags can be created or added by submitting tag names. Similar to the add task field, enter the tag and submit by hitting enter or clicking the button. At the moment, each tag has to be created separately.

![Adding new tags](/readme/addnewtags.gif)

Created tags will display below the input field. You can delete the tag prior to submitting the task by clicking on the close button on the tag.

##### Editing tasks

Tasks can be edited by clicking on the edit icons next to each task. Once clicked, the task converts to an input field with the same options as adding a new task. Just as adding a new task, submit your changes by pressing enter or clicking the button next to the input field.

![Editing tasks](/readme/edittask.gif)

You may edit one task at a time; clicking on the edit icon of a different task while editing a task will close the current edit field without saving the changes.

##### Completed tasks

When a task is complete, you can mark it by checking the checkbox next to each task. The task will be moved from your list down to the completed list.

Unchecking the checked list will return the task back to your to-do list.

Completed tasks can be removed by clicking the 'Clear' button. This action will remove the completed tasks permanently.

##### Side navigation

The side navigation—accessible on mobile by clicking the icon top-left side of the page or swiping in from the left—lets the user change the view of the list accordingly.
- All items: (main) view of all tasks
- Completed: view of all completed tasks
- Private tags: toggles the dropdown list containing unshared tags
- Shared tags: toggles the dropdown list containing shared tags
- Create shared tag: allows user to create new shared tag
- Log out: returns to sign-up/log-in page


### Personal tags

Tasks can be sorted using tags. Access your private, unshared tags from the side navigation by clicking the personal tags tab and the desired tag in the foldout menu.

Each page will display the name of the tag, today's date and the tag's completion percentage in addition to the list of tasks.

New tasks added from individual tag pages will have the associated tag attached automatically.

### Shared tags

##### Creating shared tags


## Tech

#### Front end
- HTML5/CSS3
- jQuery
- [Materialize](http://materializecss.com/)

#### Back end
- [Node.js](https://nodejs.org/en/about/)
- [Express.js](http://expressjs.com/)
- [Knex.js](http://knexjs.org/)

##### JavaScript linting rules
* 'airbnb'
* 'ryansobol/node'
* 'ryansobol/jquery'
* 'ryansobol/materialize'

## Further Development
