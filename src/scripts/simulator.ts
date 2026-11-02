/**
 * 手取りシミュレータ（サンプル値・決定的）
 * 計算仕様は現デモから踏襲: 売上=稼働日×件数×150円、リース月40,000円、
 * ガソリン=稼働日×700円、保険月18,000円、手数料=売上の10%。
 */
import { simSpec } from '../data/content';

const yen = (n: number): string => '¥' + Math.round(n).toLocaleString('ja-JP');

function initSimulator(): void {
  const days = document.getElementById('days') as HTMLInputElement | null;
  const drops = document.getElementById('drops') as HTMLInputElement | null;
  if (!days || !drops) return;

  const out = {
    vDays: document.getElementById('vDays'),
    vDrops: document.getElementById('vDrops'),
    oRev: document.getElementById('oRev'),
    oGas: document.getElementById('oGas'),
    oFee: document.getElementById('oFee'),
    oTake: document.getElementById('oTake'),
  };

  const calc = (): void => {
    const d = Number(days.value);
    const k = Number(drops.value);
    if (out.vDays) out.vDays.textContent = String(d);
    if (out.vDrops) out.vDrops.textContent = String(k);

    const rev = d * k * simSpec.unitPrice;
    const gas = d * simSpec.gasPerDay;
    const fee = rev * simSpec.feeRate;
    const take = rev - simSpec.lease - gas - simSpec.insurance - fee;

    if (out.oRev) out.oRev.textContent = yen(rev);
    if (out.oGas) out.oGas.textContent = '−' + yen(gas);
    if (out.oFee) out.oFee.textContent = '−' + yen(fee);
    if (out.oTake) out.oTake.textContent = yen(take);
  };

  days.addEventListener('input', calc);
  drops.addEventListener('input', calc);
  calc();
}

initSimulator();
