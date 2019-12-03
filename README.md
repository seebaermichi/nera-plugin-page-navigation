# Page navigation - Nera plugin
This is a plugin for the static side generator [nera](https://github.com/seebaermichi/nera) to create a page navigation.

__Note__
>For now it can only shows the siblings of the current page.  

## Usage
At first you need to place this plugin in the `src/plugins` folder of your nera project.  

You can either define the elements of the page navigation within the meta section of your markdown file by adding a `page_navigation` property there. For example like this:
```yaml
page_navigation:
  - href: '#'
    name: 'Home'
  - href: 'https://external/link.html'
    name: 'External Link'
```
or leave this property and then the direct siblings of the current page are shown.  

Finally you need to include the `src/plugins/page-navigation/views/page-navigation.pug` where ever you want to have your page navigation. Be aware that there are already different types for the page navigation available. Just uncomment the version you need or prefer.
