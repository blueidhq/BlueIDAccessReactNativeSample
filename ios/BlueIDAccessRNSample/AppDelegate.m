#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

// Add this line to import blueid library
@import blueid_access_react_native;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"BlueIDAccessRNSample";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // Add this so that the SDK initializes once your app starts
  [BlueAppDelegate didFinishLaunchingWithOptions:launchOptions];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)applicationWillResignActive:(UIApplication *)application
{
  // Add this so that the SDK clear timers and resources
  // when app is about to become inactive
  [BlueAppDelegate willResignActive];
}

- (void)applicationWillTerminate:(UIApplication *)application
{
  // Add this so that the SDK clear timers and resources
  // when app is terminated
  [BlueAppDelegate willTerminate];
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  // Add this so that the SDK restart timers and synchronize credentials
  // when app has become active again
  [BlueAppDelegate didBecomeActive];
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
  // Add this so that the SDK clear timers and resources
  // when app goes to background
  [BlueAppDelegate didEnterBackground];
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
    return [self bundleURL];
  }

  - (NSURL *)bundleURL
  {
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  #else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
  }
@end
