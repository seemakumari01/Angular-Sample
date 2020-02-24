import { Pipe, PipeTransform, Injectable } from '@angular/core';

/*
 * Custom sort pipe for sorting cards for plans, maturiy etc...,
 * currently only supports "Action card sorting for plans" by "ST"
 * type cards first,
 * TODO: extend to support multiple sorting options.
*/

@Pipe({
    name: 'cardsSort'
})
@Injectable()
export class CardsSortPipe implements PipeTransform {


    sortFunction(items: any[], field: string): any[] {
        return items.sort((a, b) => {
            if (parseInt(a.code.toLowerCase().split(field)[1], 10) < parseInt(b.code.toLowerCase().split(field)[1], 10)) {
                return -1;
            }
            return 1;
        });
    }

    transform(items: any[], cardType: string): any[] {
        if (cardType.toLowerCase() !== 'action') return items; // return if 'cardType' is not 'action'.

        const group: any = { st: [], ia: [] };

        items.forEach((a: any) => { // separate 'st' and 'ia' cards.
            if (a.code.toLowerCase().includes('ia')) {
                group.ia.push(a);
            } else {
                group.st.push(a);
            }
        });

        return [...this.sortFunction(group.st, 'st'), ...this.sortFunction(group.ia, 'ia')];
    }

}
