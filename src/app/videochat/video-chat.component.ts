/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import { Component, OnInit } from "@angular/core";

import {
  Feed,
  FeedsService
} from "../feed";


import {
  LogEntry,
  LogService
} from "../room";

interface IHighlight {
  /*
   * Feed explicitly selected as highlight by the user (using the UI)
   */
  byUser: Feed;
  /*
   * Feed currently highlighted, either manually (if byUser is set) or
   * automatically (if byUser is null)
   */
  current: Feed;
}

@Component({
  selector: "jh-video-chat",
  template: require("./video-chat.component.html")
})
export class VideoChatComponent implements OnInit {

  public highlight: IHighlight = {
    byUser: null,
    current: null,
  };

  constructor(private feedsService: FeedsService,
              private logService: LogService) {}

  public ngOnInit(): void { }

  public feeds(): Array<Feed> {
    return this.feedsService.allFeeds();
  }

  public highlightedFeed(): Feed {

    if (this.highlight.byUser !== null) {
      this.highlight.current = this.highlight.byUser;
    } else {
      let current: Feed = this.highlight.current;

      /*
       * The current one disconnected
       */
      if (current && !current.isConnected()) {
        current = null;
      }

      /*
       * If current one is still speaking, there is no need to change
       */
      if ( !(current && current.getSpeaking() && current.getVideoEnabled()) ) {
        let speaking: Feed = this.feedsService.speakingFeed();

        if (speaking && speaking.getVideoEnabled()) {
          this.highlight.current = speaking;
        } else {
          this.highlight.current = current || this.feedsService.findMain();
        }
      }
    }

    return this.highlight.current;
  }

  public mirrored(): boolean {
    let f: Feed = this.highlightedFeed();
    if (f) {
      return (f.isPublisher && !f.isLocalScreen);
    } else {
      return false;
    }
  }

  public toggleHighlightedFeed(feed: Feed): void {
    if (this.highlight.byUser !== feed) {
      this.highlight.byUser = feed;
    } else {
      this.highlight.byUser = null;
    }
  }

  public isHighlighted(f: Feed): boolean {
    return f === this.highlight.current;
  }

  public isHighlightedByUser(f: Feed): boolean {
    return f === this.highlight.byUser;
  }

  public logEntries(): Array<LogEntry> {
    return this.logService.allEntries();
  }

  public showHotkeys(): void {
    // [FIX] - toggleCheatSheet not supported yet
    // this.hotkeys.toggleCheatSheet();
    console.warn("Not implemented yet");
  }

}