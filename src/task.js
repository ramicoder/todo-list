import { format } from 'date-fns';
export default class Task {

    constructor(title, descript, date, priority, notes, checked = false) {
        this.title = title;
        this.descript = descript;
        this.date = format(new Date(date), 'yyyy-MM-dd');
        this.priority = priority;
        this.notes = notes;
        this.checked = checked;
        this.id = crypto.randomUUID();
    }
}