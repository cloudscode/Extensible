/**
 * @class Ext.ensible.cal.DayBodyTemplate
 * @extends Ext.XTemplate
 * <p>This is the template used to render the scrolling body container used in {@link Ext.ensible.cal.DayView DayView} and 
 * {@link Ext.ensible.cal.WeekView WeekView}. This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Ext.ensible.cal.EventRecord}.</p>
 * <p>Note that this template would not normally be used directly. Instead you would use the {@link Ext.ensible.cal.DayViewTemplate}
 * that internally creates an instance of this template along with a {@link Ext.ensible.cal.DayHeaderTemplate}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.ensible.cal.DayBodyTemplate', {
    extend: 'Ext.XTemplate',
    
    // private
    constructor: function(config){
        
        Ext.apply(this, config);
    
        Ext.ensible.cal.DayBodyTemplate.superclass.constructor.call(this,
            '<table class="ext-cal-bg-tbl" cellspacing="0" cellpadding="0" style="height:{dayHeight}px;">',
                '<tbody>',
                    '<tr height="1">',
                        '<td class="ext-cal-gutter"></td>',
                        '<td colspan="{dayCount}">',
                            '<div class="ext-cal-bg-rows">',
                                '<div class="ext-cal-bg-rows-inner">',
                                    '<tpl for="times">',
                                        '<div class="ext-cal-bg-row ext-row-{[xindex]}" style="height:{parent.hourHeight}px;">',
                                            '<div class="ext-cal-bg-row-div {parent.hourSeparatorCls}" style="height:{parent.hourSeparatorHeight}px;"></div>',
                                        '</div>',
                                    '</tpl>',
                                '</div>',
                            '</div>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td class="ext-cal-day-times">',
                            '<tpl for="times">',
                                '<div class="ext-cal-bg-row" style="height:{parent.hourHeight}px;">',
                                    '<div class="ext-cal-day-time-inner"  style="height:{parent.hourHeight-1}px;">{.}</div>',
                                '</div>',
                            '</tpl>',
                        '</td>',
                        '<tpl for="days">',
                            '<td class="ext-cal-day-col">',
                                '<div class="ext-cal-day-col-inner">',
                                    '<div id="{[this.id]}-day-col-{.:date("Ymd")}" class="ext-cal-day-col-gutter" style="height:{parent.dayHeight}px;"></div>',
                                '</div>',
                            '</td>',
                        '</tpl>',
                    '</tr>',
                '</tbody>',
            '</table>'
        );
    },

    // private
    applyTemplate : function(o){
        this.today = Ext.ensible.Date.today();
        this.dayCount = this.dayCount || 1;
        
        var i = 0, days = [],
            dt = Ext.Date.clone(o.viewStart);
            
        for(; i<this.dayCount; i++){
            days[i] = Ext.ensible.Date.add(dt, {days: i});
        }

        var times = [],
            start = this.viewStartHour,
            end = this.viewEndHour,
            mins = this.hourIncrement,
            dayHeight = this.hourHeight * (end - start)
            fmt = Ext.ensible.Date.use24HourTime ? 'G:i' : 'ga';
        
        // use a fixed DST-safe date so times don't get skipped on DST boundaries
        dt = Ext.ensible.Date.add(new Date('5/26/1972'), {hours: start});
        
        for(i=start; i<end; i++){
            times.push(Ext.Date.format(dt, fmt));
            dt = Ext.ensible.Date.add(dt, {minutes: mins});
        }
        
        return Ext.ensible.cal.DayBodyTemplate.superclass.applyTemplate.call(this, {
            days: days,
            dayCount: days.length,
            times: times,
            hourHeight: this.hourHeight,
            hourSeparatorCls: this.showHourSeparator ? '' : 'no-sep', // the class suppresses the default separator
            dayHeight: dayHeight,
            hourSeparatorHeight: (this.hourHeight / 2) - 1
        });
    }
});

Ext.ensible.cal.DayBodyTemplate.prototype.apply = Ext.ensible.cal.DayBodyTemplate.prototype.applyTemplate;
