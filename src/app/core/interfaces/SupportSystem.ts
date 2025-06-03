export class SelectableItem {
    id!: number;
    name!: string;
}

export class Bug extends SelectableItem { }
export class AreaOfConcern extends SelectableItem { }
export class Priority extends SelectableItem { }
export class Status extends SelectableItem { }

export class Ticket {
    ticketId!: number;
    bugId!: number;
    bugDs!: string;
    areaOfConcernId!: number;
    areaOfConcernDs!: string;
    assignedUserId!: number;
    assignedUserName!: string;
    assignedUserRole!: number;
    statusId?: number;
    statusDs?: string;
    ticketPriorityId!: number;
    ticketPriorityDs?: string;
    ticketGenerateTimeStamp!: Date;
    ticketUserChangeTimeStamp?: Date;
    statusUpdateTimeStamp?: Date;
    assigneeRemarks?: string;
    message!: string;
    addedUserId!: number;
    addedUserName!: string;
    addedUserRole!: number;
    url?: string;
    dueDate!: Date;
}
