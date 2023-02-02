export default class TabMenuHelper {
    public static hideTabBar() {
        const tabBar = document.getElementById('app-tab-bar');
        const fabButton = document.getElementById('fab-button');

        if (tabBar !== null && fabButton !== null) {
            tabBar.style.display = 'none';
            fabButton.style.display = 'none';
        }
    }

    public static showTabBar() {
        const tabBar = document.getElementById('app-tab-bar');
        const fabButton = document.getElementById('fab-button');

        if (tabBar !== null && fabButton !== null) {
            tabBar.style.display = 'flex';
            fabButton.style.display = 'flex';
        }
    }
}