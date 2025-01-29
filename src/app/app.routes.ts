import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { NonAuthGuard } from '@guards/non-auth.guard';
import { LoginComponent } from '@modules/login/login.component';
import { MainComponent } from '@modules/main/main.component';
import { RecoverPasswordComponent } from '@modules/recover-password/recover-password.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { SettlementComponent } from '@pages/settlement/settlement.component';
import { WithdrawComponent } from '@pages/withdraw/withdraw.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                component: DashboardComponent
            },
            {
                path: 'withdraw',
                component: WithdrawComponent
            },
            {
                path: 'settlement',
                component: SettlementComponent
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'change-password',
        component: RecoverPasswordComponent,
        canActivate: [AuthGuard]
    },
    {path: '**', redirectTo: ''}
];
