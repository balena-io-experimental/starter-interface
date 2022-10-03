//
// Functions to call on boot
//

import checkHostname from '@/boot/setHostname'

export default function boot() {
  // List of functions to call on first boot
  void checkHostname()
}
