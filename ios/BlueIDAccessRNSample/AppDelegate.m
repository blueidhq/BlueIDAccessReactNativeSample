#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@import blueid_access_react_native;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"BlueIDAccessRNSample";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  [BlueAppDelegate didFinishLaunchingWithOptions:launchOptions];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)applicationWillTerminate:(UIApplication *)application
{
  [BlueAppDelegate willTerminate];
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  [BlueAppDelegate didBecomeActive];
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
  [BlueAppDelegate didEnterBackground];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

// #import "AppDelegate.h"

// #import <React/RCTBundleURLProvider.h>

// @import blueid_access_react_native;

// @implementation AppDelegate

// - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
// {
//   self.moduleName = @"BlueIDAccessExample";
//   // You can add your custom initial props in the dictionary below.
//   // They will be passed down to the ViewController used by React Native.
//   self.initialProps = @{};
  
//   [BlueAppDelegate didFinishLaunchingWithOptions:launchOptions];

//   return [super application:application didFinishLaunchingWithOptions:launchOptions];
// }

// - (void)applicationWillTerminate:(UIApplication *)application
// {
//   [BlueAppDelegate willTerminate];
// }

// - (void)applicationDidBecomeActive:(UIApplication *)application
// {
//   [BlueAppDelegate didBecomeActive];
// }

// - (void)applicationDidEnterBackground:(UIApplication *)application
// {
//   [BlueAppDelegate didEnterBackground];
// }

// - (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
// {
// #if DEBUG
//   return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
// #else
//   return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
// #endif
// }

// @end
